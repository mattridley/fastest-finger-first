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

export default async function SendCommand(req, res) {
  const { event, ...data } = req.body;
  res.send(201);
  try {
    await pusher.trigger("fastest-finger-first", event, data || "clear");
  } catch (e) {
    console.error(e);
  }
}
