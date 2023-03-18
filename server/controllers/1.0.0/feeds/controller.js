const feedsDb = require('../../../lib/feeds-db')

//Must have 6 - 16 characters, must be have a least a number and one special character
const regularExpression = /^[a-zA-Z0-9_-]{6,32}$/;

async function index(req, res) {
  res.json(200, {
    result: await feedsDb.getFeeds(),
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

  if(!req.body.key || typeof req.body.key !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Key not set",
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
      result: await feedsDb.addFeed({
        name: req.body.name,
        activated,
        key: req.body.key,
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
  if(req.body.key !== undefined && typeof req.body.key !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Key is required",
    });
    return;
  }

  let updateQuery = { name: req.body.name };

  if(req.body.key) {
    updateQuery.key = req.body.key;
  } else if(req.body.activated !== undefined) {
    const activated = typeof req.body.activated === "string" 
      ? (req.body.activated === "true" || req.body.activated === "1")
      : (!!req.body.activated);
    updateQuery.activated = req.body.activated;
  }

  try {
    res.json(200, {
      result: await feedsDb.updateFeed(updateQuery),
    });
  } catch(e) {
    res.json(403, {
      error: "UNAUTHORIZED",
      description: "Permission Denied",
    });
  }
}

async function broadcast(req, res) {
  if(req.body.name === undefined || typeof req.body.name !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Name is required",
    });
    return;
  }
  if(req.body.broadcast === undefined || typeof req.body.broadcast !== "boolean") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "broadcast is required",
    });
    return;
  }

  let updateQuery = { name: req.body.name };

  try {
    const feed = await feedsDb.updateFeed(updateQuery);

    // if feed.broadcast === true
      // Start ffmpeg cli
    // else
      // Search and stop ffmpeg

    res.json(200, {
      result: feed
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
      result: await feedsDb.removeFeed(req.body.name),
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
  broadcast,
  remove,
};