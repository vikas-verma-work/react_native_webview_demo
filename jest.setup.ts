import { BackHandler } from "react-native";

jest
  .spyOn(BackHandler, "addEventListener")
  .mockImplementation(() => ({ remove: jest.fn() } as any));

jest.spyOn(BackHandler, "removeEventListener").mockImplementation(jest.fn());
