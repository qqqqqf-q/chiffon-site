// wawoff2 不带类型声明;这里只声明用到的解压接口。
declare module 'wawoff2' {
  const wawoff2: {
    decompress(input: Uint8Array): Promise<Uint8Array>;
  };
  export default wawoff2;
}
