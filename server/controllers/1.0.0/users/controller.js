const authDb = require('../../../lib/auth-db')

//Must have 6 - 16 characters, must be have a least a number and one special character
const regularExpression = /^[a-zA-Z0-9_-]{6,32}$/;

async function index(req, res) {
  const users = await authDb.getUsers();

  res.json(200, {
    result: users,
  });
}

async function create(req, res) {
  if(!req.body.username || typeof req.body.username !== "string" || !regularExpression.test(req.body.username)) {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Username not set",
    });
    return;
  }

  if(!req.body.password || typeof req.body.password !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Password not set",
    });
    return;
  }

  if(!req.body.permissions || !Array.isArray(req.body.permissions)) {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Permissions not set",
    });
    return;
  }

  try {
    res.json(201, {
      result: await authDb.addUser({
        username: req.body.username,
        password: req.body.password,
        permissions: req.body.permissions,
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
  if(!req.body.username || typeof req.body.username !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Username is required",
    });
    return;
  }

  let updateQuery = { username: req.body.username };

  if(req.body.password) {
    updateQuery.password = req.body.password;
  } else if(req.body.permissions) {
    updateQuery.permissions = req.body.permissions;
  }

  try {
    res.json(200, {
      result: await authDb.updateUser(updateQuery)
    });
  } catch(e) {
    res.json(500, {
      error:"INTERNAL_SERVICE_ERROR",
      description:"There was a problem with processing your query"
    })
  }
}



async function remove(req, res) {
  if(req.body.username === undefined || typeof req.body.username !== "string") {
    res.json(422, {
      error: "VALIDATION_ERROR",
      description: "Username is required",
    });
    return;
  }

  try {
    res.json(200, {
      result: await authDb.removeUser(req.body.username.toLowerCase()),
    });
  } catch(e) {
    res.json(500, {
      error:"INTERNAL_SERVICE_ERROR",
      description:"There was a problem with processing your query"
    })
  }
}

async function me(req, res) {
  res.json(200, {
    result: {
      ...req.user,
      password: false,
    },
  });
}

async function login(req, res) {
  try {
    const session = await authDb.createSession(req.body.username, req.body.password);
    res.json(200, {
      result: session,
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
  me,
  login,
};