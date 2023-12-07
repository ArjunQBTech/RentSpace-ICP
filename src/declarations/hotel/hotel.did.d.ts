import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AutoScalingCanisterSharedFunctionHook = ActorMethod<
  [string],
  string
>;
export interface Hotel {
  'createHotel' : ActorMethod<[string, HotelInfo], undefined>,
  'getHotel' : ActorMethod<[string], [] | [HotelInfo]>,
  'getHotelId' : ActorMethod<[string], Array<string>>,
  'getPK' : ActorMethod<[], string>,
  'scanRent' : ActorMethod<
    [string, string, bigint, [] | [boolean]],
    ScanHotels
  >,
  'skExists' : ActorMethod<[string], boolean>,
  'transferCycles' : ActorMethod<[], undefined>,
  'updateHotel' : ActorMethod<[string, HotelInfo], [] | [HotelInfo]>,
}
export interface HotelInfo {
  'hotelDes' : string,
  'hotelImage' : string,
  'hotelPrice' : string,
  'hotelTitle' : string,
  'hotelLocation' : string,
}
export type ScalingLimitType = { 'heapSize' : bigint } |
  { 'count' : bigint };
export interface ScalingOptions {
  'autoScalingHook' : AutoScalingCanisterSharedFunctionHook,
  'sizeLimit' : ScalingLimitType,
}
export interface ScanHotels {
  'nextKey' : [] | [string],
  'hotels' : Array<HotelInfo>,
}
export interface _SERVICE extends Hotel {}
