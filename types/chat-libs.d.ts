declare module "sockjs-client" {
  const SockJS: any;
  export default SockJS;
}

declare module "stompjs" {
  const Stomp: any;
  export default Stomp;
}

declare module "stompjs/lib/stomp" {
  export const Stomp: any;
}
