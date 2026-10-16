#!/usr/bin/env bash
# SCARDULE 배포 스크립트 (.github/workflows/deploy.yml 에서 SSH로 실행)
#
# Git 변경 여부와 PM2 상태를 독립적으로 처리한다.
#   1) 새 커밋이 있거나 빌드 결과물이 없으면: pull → npm ci → build
#   2) PM2 프로세스는 Git 변경과 무관하게 항상 점검
#      - 미등록 또는 실행 디렉터리가 다름 → (삭제 후) APP_DIR에서 새로 시작
#      - 새 빌드가 있거나 online이 아님 → 재시작
#   3) pm2 save, HTTP 응답 확인
#
# 서버 최초 1회 설정:
#   ln -sf ~/scardule/scripts/deploy.sh ~/deploy_scardule.sh

APP_NAME="scardule"
APP_DIR="${APP_DIR:-$HOME/scardule}"
BRANCH="main"
PORT="${PORT:-3000}"

log() { echo "[deploy] $*"; }

pm2_field() { # $1: status | cwd
  pm2 jlist 2>/dev/null | node -e '
    let s = "";
    process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const p = JSON.parse(s).find((p) => p.name === process.argv[1]);
      if (p) console.log(process.argv[2] === "cwd" ? p.pm2_env.pm_cwd : p.pm2_env.status);
    });' "$APP_NAME" "$1"
}

pm2_start_fresh() {
  pm2 start npm --name "$APP_NAME" --cwd "$APP_DIR" -- start
}

main() {
  # 비대화형 SSH 세션에서는 nvm 경로가 잡히지 않으므로 직접 로드
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
  fi
  set -euo pipefail

  cd "$APP_DIR"

  # ---------- 1. 코드 갱신 / 빌드 ----------
  git fetch origin "$BRANCH"
  local local_rev remote_rev
  local_rev=$(git rev-parse HEAD)
  remote_rev=$(git rev-parse "origin/$BRANCH")

  local built=false
  if [ "$local_rev" != "$remote_rev" ]; then
    log "새 커밋: ${local_rev:0:7} → ${remote_rev:0:7}"
    git merge --ff-only "origin/$BRANCH"
    npm ci
    npm run build
    built=true
  elif [ ! -f .next/BUILD_ID ]; then
    # 이전 빌드가 실패해 .next 가 비어 있는 경우 재빌드
    log "Git 변경 없음, 빌드 결과물 없음 → 재빌드"
    npm ci
    npm run build
    built=true
  else
    log "Git 변경 없음 (${local_rev:0:7}) → 빌드 생략"
  fi

  # ---------- 2. PM2 프로세스 점검 ----------
  if ! pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    log "PM2 미등록 → 새로 시작"
    pm2_start_fresh
  else
    local status cwd
    status=$(pm2_field status)
    cwd=$(pm2_field cwd)
    if [ "$cwd" != "$APP_DIR" ]; then
      log "실행 디렉터리 불일치 ($cwd) → 삭제 후 재등록"
      pm2 delete "$APP_NAME"
      pm2_start_fresh
    elif [ "$built" = true ] || [ "$status" != "online" ]; then
      log "PM2 재시작 (status=$status, built=$built)"
      pm2 restart "$APP_NAME" --update-env
    else
      log "PM2 online → 재시작 생략"
    fi
  fi

  pm2 save

  # ---------- 3. 응답 확인 ----------
  local code=000
  for _ in $(seq 1 15); do
    code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT" || true)
    if [ "$code" != "000" ] && [ "${code:0:1}" != "5" ]; then
      log "HTTP $code → 배포 완료"
      return 0
    fi
    sleep 2
  done
  log "HTTP 응답 실패 (code=$code)"
  pm2 logs "$APP_NAME" --lines 30 --nostream || true
  return 1
}

# 실행 중 git merge 로 이 파일이 바뀌어도 안전하도록 한 줄에서 main 실행 후 종료
main "$@"; exit $?
