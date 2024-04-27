const router= require("express").Router();

const auth= require("../middleware/auth");
const noteControllers= require("../controllers/noteControllers");

router.use(auth);

router.route("/")
    .get(noteControllers.getAllNotes)
    .post(noteControllers.createNewNote);

router.route("/:id")
    .put(noteControllers.updateNote)
    .delete(noteControllers.deleteNote);

router.route("/archived")
    .get(noteControllers.getAllArchivedNotes)
    .post(noteControllers.changeStatusNotes);

module.exports= router;