//@desc :       Get all Bootcamps 
//@route :   GET /api/v1/bootcamps
//@access:          Public
exports.GetBootcamps = (req, res, next) => {
      res.status(200).json({ success: true, msg: "Show all bootcamps" });
}


//@desc :       get a bootcamp with ID 
//@route :      GET /api/v1/bootcamps/:id
//@access:            Public
exports.GetBootcamp = (req, res, next) => {
      res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
}

//@desc :       create a new bootcamp 
//@route :      POST /api/v1/bootcamps
//@access:            Private
exports.createBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ success: true, msg: `create bootcamp` });
}

//@desc :       update a bootcamp 
//@route :      PUT /api/v1/bootcamps/:id
//@access:            Private
exports.updateBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ success: true, msg: `update bootcamp ${req.params.id}` });
}


//@desc :       delete a bootcamp 
//@route :      PUT /api/v1/bootcamps/:id
//@access:            Private
exports.deleteBootcamp = (req, res, next) => {
     res
       .status(200)
       .json({ success: true, msg: `deleted bootcamp ${req.params.id}` });
}

