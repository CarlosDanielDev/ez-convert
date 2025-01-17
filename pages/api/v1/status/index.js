function status(_, response) {
  response.status(200).json({ hello: "world" });
}

export default status;
