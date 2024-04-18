import { Datum } from './Datum';

export interface AddOption {
  payload: {
    style: {
      [key: string]: number | string;
    };
    animation: {
      duration: number;
      easing: string;
    };
  };
}

export interface AddAction extends AddOption {
  action: 'add';
  data: Datum;
}

export interface AddPatchAction extends AddOption {
  action: 'addPatch';
  data: Datum[];
}
