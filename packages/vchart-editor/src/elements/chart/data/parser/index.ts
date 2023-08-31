import type { IDataParserConstructor } from './../interface';
import { ClipBoardParser } from './clipboard';
export const DataParser: { [key: string]: IDataParserConstructor } = {
  clipBoard: ClipBoardParser
};
