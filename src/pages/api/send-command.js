import Pusher from "pusher";
import getConfig from "next/config";

const config = Object.assign(
  {},
  getConfig().publicRuntimeConfig.pusher,
  getConfig().serverRuntimeConfig.pusher
);

const pusher = new Pusher({
  ...config,
  useTLS: true,
});

export default function SendCommand(req, res) {
  const { event, ...data } = req.body;
  pusher.trigger("fastest-finger-first", event, data || "clear");

  res.send(200);
}
