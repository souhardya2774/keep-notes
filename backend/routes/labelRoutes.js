const router= require("express").Router();

const auth= require("../middleware/auth");
const labelControllers= require("../controllers/labelControllers");

router.use(auth);

router.route("/")
    .get(labelControllers.getAllLabels)
    .post(labelControllers.createNewLabel);

router.route("/:id")
    .get(labelControllers.getAllNotes)
    .delete(labelControllers.deleteLabel);

router.route("/edit/:id")
    .put(labelControllers.updateLabelName);

module.exports= router;