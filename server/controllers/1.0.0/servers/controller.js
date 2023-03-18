const rtmpDb = require('../../../lib/rtmp-db')

//Must have 6 - 16 characters, must be have a least a number and one special character
const regularExpression = /^[a-zA-Z0-9_-]{6,32}$/;

async function index(req, res) {
  res.json(200, {
    result: await rtmpDb.getServers(),
  });
}

async function create(req, res) {
  if(!req.body.name || typeof req.body.name !== "string" || !regularExpression.test(req.body.name)) {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Name not set",
    });
    return;
  }

  if(!req.body.url || typeof req.body.url !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Url not set",
    });
    return;
  }

  if(req.body.activated === undefined) {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Activated not set",
    });
    return;
  }
  const activated = typeof req.body.activated === "string" 
          ? (req.body.activated === "true" || req.body.activated === "1")
          : (!!req.body.activated);
  try {
    res.json(201, {
      result: await rtmpDb.addServer({
        name: req.body.name,
        activated,
        url: req.body.url,
      }),
    });
  } catch(e) {
    res.json(500, {
      error:"INTERNAL_SERVICE_ERROR",
      description:"There was a problem with processing your query"
    })
  }


}

async function update(req, res) {
  if(req.body.name !== undefined && typeof req.body.name !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Name is required",
    });
    return;
  }
  if(req.body.url !== undefined && typeof req.body.url !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Url is required",
    });
    return;
  }

  let updateQuery = { name: req.body.name };

  if(req.body.url) {
    updateQuery.url = req.body.url;
  } else if(req.body.activated !== undefined) {
    const activated = typeof req.body.activated === "string" 
      ? (req.body.activated === "true" || req.body.activated === "1")
      : (!!req.body.activated);
    updateQuery.activated = req.body.activated;
  }

  try {
    res.json(200, {
      result: await rtmpDb.updateServer(updateQuery),
    });
  } catch(e) {
    res.json(403, {
      error: "UNAUTHORIZED",
      description: "Permission Denied",
    });
  }
}

async function remove(req, res) {
  if(req.body.name !== undefined && typeof req.body.name !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Name is required",
    });
    return;
  }

  try {
    res.json(200, {
      result: await rtmpDb.removeServer(req.body.name),
    });
  } catch(e) {
    res.json(403, {
      error: "UNAUTHORIZED",
      description: "Permission Denied",
    });
  }
}

module.exports = {
  index,
  create,
  update,
  remove,
};