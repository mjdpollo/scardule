export type Schedule = {
  id: number | null;
  stock_date: string | null;
  release_date: string | null;
  car_model: string;
  car_number: string;
  color_code: string;
  supplier: string;
  charger: string;
  content: string | null;
  estimate: number;
  note: string | null;
  status: string;

  front_bumper: boolean;
  left_front_fender: boolean;
  right_front_fender: boolean;
  left_front_door: boolean;
  right_front_door: boolean;
  left_rear_door: boolean;
  right_rear_door: boolean;
  left_rear_fender: boolean;
  right_rear_fender: boolean;
  rear_bumper: boolean;
  rear_door: boolean;
  bonnet: boolean;
  hood: boolean;

  number_of_repairs: number | null;
};
