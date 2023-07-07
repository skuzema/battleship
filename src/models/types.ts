import WebSocket from 'ws';

export interface WebSocketWithId extends WebSocket {
  connectionId: number;
}

export type CommandType = {
  type: string;
  data: string;
  id: number;
};

export type RegRequestData = {
  name: string;
  password: string;
};

export type RegResponseData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};
