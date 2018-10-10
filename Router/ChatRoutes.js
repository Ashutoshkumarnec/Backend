var express = require("express");
var router = express.Router();
const emailExists = require("email-exists");
var userapi = require("../API/ChatApi.js");
var mailer = require("../NodeMailer/nodemailer.js");
var users = [];
// router.post("/SignUp", async function(req, res) {
//   try {
//     console.log("Response fron Client", req.body);
//     let found = await userapi.Findss(req.body);
//     if (found.length != 0) {
//     } else {
//       console.log("Nothing Found");
//     }
//     let resultfromapi = await userapi.createnewuser(req.body);
//     let resultfromapi1 = await userapi.find(req.body);
//     console.log("After SignUp", resultfromapi1[0]._id);
//     res.send({ data: resultfromapi1[0]._id });
//   } catch (err) {
//     res.send({ data: "User Already Registered" });
//   }
// });
router.post("/SaveGroupMessages", async function(req, res) {
  try {
    console.log("Group Message Details", req.body);
    var Find = await userapi.FindsGroupMsg(req.body.Room);
    if (Find.length !== 0) {
      console.log("Message found");
      userapi.UpdateGroupMessage(req.body);
      res.send({ data: "Messages Updated" });
    } else {
      var GroupMessage = userapi.SaveGroupMessage(req.body);
      res.send({ data: "Message Saved" });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/SendGroupDetails", async function(req, res) {
  try {
    var found = await userapi.FindGroupDetails(req.body.email);
    res.send({ data: found });
  } catch (err) {
    console.log(err);
  }
});
router.post("/AddGroupDetails", async function(req, res) {
  try {
    console.log("Response from FrontEnd", req.body);
    var find = await userapi.InserDetails(req.body);
    // for (var i = 0; i < req.body.GroupUser.length; i++) {
    //   users.push({ Username: req.body.GroupUser[i] });
    // }
    console.log("all User", users);
    var find1 = await userapi.PushUser(req.body);
    var found = await userapi.FindGroupDetails(req.body.Admin);
    res.send({ data: found });
    console.log("All Group", found);
  } catch (err) {
    console.log("Error", err);
  }
});
router.post("/GroupAdd", async function(req, res) {
  try {
    console.log("Adding all users");
    var Find = await userapi.FindAllGroupUser(req.body.email);
    res.send({ data: Find });
    console.log("All Group user", Find);
  } catch (err) {
    console.log("Error", err);
  }
});
router.post("/FindGroupMessage", async function(req, res) {
  try {
    console.log("AllBody Details", req.body);
    let FindGroupMessage = await userapi.FindsGroupMsg(req.body.Room);
    if (FindGroupMessage.length !== 0) {
      console.log("Details Found");
      res.send({ data: FindGroupMessage });
    } else {
      res.send({ data: "No Record" });
    }
  } catch (err) {
    console.log("Error", err);
  }
});
router.post("/UpdateAllUser", async function(req, res) {
  try {
    let finds = await userapi.FindAll(req.body.email);
    res.send({ alluser: finds });
  } catch (err) {}
});
router.post("/SignUps", async function(req, res) {
  try {
    console.log("Response fron Client", req.body);
    // let found = await userapi.Findss(req.body);
    // let resultfromapi = await userapi.createnewuser(req.body);
    let finds = await userapi.FindAll(req.body.Username);
    console.log("All users", finds);
    let resultfromapi1 = await userapi.find(req.body);
    console.log("After SignUp", resultfromapi1[0]._id);
    var found = await userapi.FindGroupDetails(req.body.email);
    res.send({
      data: resultfromapi1[0]._id,
      data1: resultfromapi1[0].Status,
      alluser: finds,
      AllGroupUser: found
    });
  } catch (err) {
    res.send({ data: "User Already Registered" });
  }
});
router.post("/ChangeStatus", async function(req, res) {
  try {
    // console.log("Looged out", localStorage.getItem(email));
    console.log("Changing Status", req.body);
    let Change = await userapi.ChangeStatus(req.body);
    res.send({ data: "Status Changed" });
  } catch (err) {
    res.send({ data: "Error" });
  }
});
router.post("/CheckAvailable", async function(req, res) {
  try {
    console.log("Response fron Client", req.body);
    // let found = await userapi.Findss(req.body);
    // let resultfromapi = await userapi.createnewuser(req.body);
    let found = await userapi.FindReset(req.body);
    console.log("After ", found);
    if (found.length != 0) {
      console.log("here");
      if (found[0].expire !== true) {
        console.log("here1");
        let resultfromapi1 = await userapi.updateReset(req.body);
        res.send({ data: "Allowed" });
      } else {
        console.log("here2");
        res.send({ data: "Error" });
      }
    } else {
      res.send({ data: "No Record found" });
    }
    // console.log("After finding", found);
    // let resultfromapi1 = await userapi.updateReset(req.body);
    // console.log("After setting ", resultfromapi1);
  } catch (err) {
    res.send({ data: "User Already Registered" });
  }
});
router.post("/Reset1", async function(req, res) {
  try {
    console.log("In Reset", req.body);
    console.log(
      "Response fron Client",
      req.body.data.password,
      " id",
      req.body.id
    );
    let Found1 = await userapi.FindUser(req.body.id);
    let Found = await userapi.FinalResetUpdate(req.body);
    res.send({ data: "Password Reset", email: Found1[0].email });
  } catch (err) {
    // console.log("After finding", found);
    // let resultfromapi1 = await userapi.updateReset(req.body);
    // console.log("After setting ", resultfromapi1);
    res.send({ data: "User Already Registered" });
  }
});
router.post("/Login", async function(req, res) {
  try {
    console.log("Data from Front End", req.body);
    var updates = await userapi.UpdatesLogin(req.body);
    var GoLogin = await userapi.CheckLogin(req.body);
    if (GoLogin.length !== 0) {
      await userapi.ChangeStatus1(req.body.email);
      res.send({ data: GoLogin });
    } else {
      res.send({
        data:
          "User Not Registered or not Verified or Wrong Password or Already LoggedIn"
      });
    }
  } catch (err) {
    res.send({ data: "Error Occured" });
  }
});
router.post("/CheckLogin", async function(req, res) {
  try {
    var find = await userapi.FindLogin(req.body);
    res.send({ data: find[0].Login });
  } catch (err) {}
});
router.post("/Verified", async function(req, res) {
  try {
    var updatestatus = await userapi.UpdateStatusVerified(req.body);
    res.send({ data: "Email Verified , Now you can Login" });
    console.log("Verified", updatestatus);
  } catch (err) {
    res.send({ data: "Error occured " });
    console.log("Error occured");
  }
});
router.post("/Registration", async function(req, res) {
  try {
    console.log("Registration Details :", req.body);
    let check = await emailExists({
      sender: "priya16nec@gmail.com",
      recipient: req.body.email,
      timeout: 7000
    });
    if (check === "MAY_EXIST") {
      var resultsfromapi = await userapi.CreateRegister(req.body);
      var resultfromapi1 = await userapi.Findss1(req.body.email);
      var sendmail = await mailer.Sendsmail(
        req.body.email,
        resultfromapi1[0]._id,
        "Login"
      );
      res.send({ data: "Registration Successful , Verify your Account" });
    } else {
      res.send({ data: "Google account not found" });
    }
  } catch (err) {
    res.send({ data: "User Allready Registered" });
    console.log(err);
  }
});
router.post("/Forget", async function(req, res) {
  try {
    console.log("Forget Details :", req.body);
    var resultfromapi1 = await userapi.Findss1(req.body.email);
    var token = Math.floor(Math.random() * 10000000000000000000);
    var restfind = await userapi.ResetFind(resultfromapi1[0]._id);
    console.log("Reset Find", restfind);
    if (restfind.length !== 0) {
      var resetup = await userapi.resetdetailupd(resultfromapi1[0]._id, token);
    } else {
      var cretes = await userapi.createsdetailsupd(
        resultfromapi1[0]._id,
        token
      );
    }
    if (resultfromapi1.length !== 0) {
      var sendmail = await mailer.Sendsmail(
        req.body.email,
        resultfromapi1[0]._id,
        token,
        "passwordreset"
      );
      res.send({ data: "Password Reset Link has been Sent " });
    } else {
      res.send({ data: "User Not Found" });
    }
  } catch (err) {
    res.send({ data: "User Allready Registered" });
    console.log(err);
  }
});

router.post("/Find", async function(req, res) {
  try {
    console.log("All user ", req.body);
    let resultfromapi1 = await userapi.find(req.body);
    console.log("Result from api", resultfromapi1[0]._id);
    let findmessages = await userapi.FindAllMesg(
      req.body.myid,
      resultfromapi1[0]._id
    );
    console.log("After findmessages", findmessages);
    let findmessages1 = await userapi.FindAllMesg1(
      req.body.myid,
      resultfromapi1[0]._id
    );
    console.log("All Massage");
    if (findmessages.length != 0) {
      res.send({ data: findmessages[0] });
    } else if (findmessages1.length != 0) {
      res.send({ data: findmessages1[0] });
    } else {
      res.send({ data: "No Record" });
    }
  } catch (err) {
    res.send({ data: "User Already Registered" });
  }
});
router.post("/SaveMessages", async function(req, res) {
  try {
    console.log("in save messages", req.body);
    let resultfromapi1 = await userapi.find(req.body);
    console.log("Result from find", resultfromapi1);
    let resultfrom = await userapi.Finds(req.body, resultfromapi1[0]._id);
    let resultfrom1 = await userapi.Finds1(req.body, resultfromapi1[0]._id);
    console.log("Length", resultfrom.length);
    if (resultfrom.length != 0) {
      console.log("inside 1");
      let findmessages = await userapi.UpdateMessages(
        req.body,
        resultfromapi1[0]._id
      );
    } else if (resultfrom1.length != 0) {
      console.log("inside 1");
      let findmessages = await userapi.UpdateMessages1(
        req.body,
        resultfromapi1[0]._id
      );
    } else {
      let findmessages = await userapi.SaveMessage(
        req.body,
        resultfromapi1[0]._id
      );
      console.log(findmessages);
    }

    console.log(findmessages);
    res.send({ data: "User Registred" });
  } catch (err) {
    res.send({ data: "User Already Registered" });
  }
});
module.exports = router;
