module.exports = {
  serverRuntimeConfig: {
    pusher: {
      secret: process.env.PUSHER_SECRET_KEY,
    },
  },
  publicRuntimeConfig: {
    pusher: {
      appId: "1129293",
      key: "ec26b229afe9fbf00ab0",
      cluster: "eu",
    },
  },
};
