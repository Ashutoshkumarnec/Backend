var schema1 = require("../Schema/ChatSchema.js");
var schema = require("../Schema/RegisterSchema.js");
var schema2 = require("../Schema/ResetSchema");
var schema3 = require("../Schema/GroupUserDetails");
var schema4 = require("../Schema/GroupMessage");
module.exports = {
  createnewuser: function(data) {
    return new Promise((resolve, reject) => {
      schema.create(
        {
          username: data.Username
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  UpdateLastSeen: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema.update({ email: data }, { $set: { LastSeen: data1 } }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  LastSeen: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: data }, { LastSeen: 1 }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  UpdateGroupMessage: function(data) {
    return new Promise((resolve, reject) => {
      schema4.update(
        { GroupRoom: data.Room },
        {
          $push: {
            Message: [
              {
                Messagefrom: data.OwnUsername,
                Messages: data.Message,
                Time: data.Time
              }
            ]
          }
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  SaveGroupMessage: function(data) {
    return new Promise((resolve, reject) => {
      schema4.create({
        GroupRoom: data.Room,
        Message: {
          Messagefrom: data.OwnUsername,
          Messages: data.Message,
          Time: data.Time
        }
      });
    });
  },
  FindsGroupMsg: function(data) {
    return new Promise((resolve, reject) => {
      schema4.find({ GroupRoom: data }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  InserDetails: function(data) {
    return new Promise((resolve, reject) => {
      schema3.create(
        {
          GroupName: data.GroupName,
          GroupRoom: data.GroupRoom,
          GroupUser: [],
          GroupAdmin: data.Admin
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  FindGroupDetails: function(data) {
    return new Promise((resolve, reject) => {
      schema3.find({ GroupUser: { $elemMatch: { $eq: data } } }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  FindAllGroupUser: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: { $not: new RegExp(data) } }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  resetdetailupd: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema2.update(
        { id: data },
        { $set: { token: data1, expire: false } },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  createsdetailsupd: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema2.create({ id: data, token: data1, expire: false }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  FindUser: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ _id: data }, { email: 1 }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  FinalResetUpdate: function(data) {
    return new Promise((resolve, reject) => {
      schema.update(
        { _id: data.id },
        {
          $set: {
            password: data.data.password,
            Status: "offline",
            Login: "Not Allowed"
          }
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  FindReset: function(data) {
    return new Promise((resolve, reject) => {
      schema2.find({ id: data.id, token: data.token }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  updateReset: function(data) {
    return new Promise((resolve, reject) => {
      schema2.update(
        { id: data.id, token: data.token },
        { $set: { expire: true } },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  ResetFind: function(data) {
    return new Promise((resolve, reject) => {
      schema2.find({ id: data }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  Findss1: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: data }, { _id: 1 }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  FindAll: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: { $not: new RegExp(data) } }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  UpdatesLogin: function(data) {
    return new Promise((resolve, reject) => {
      schema.update({ email: data.email }, { Login: "Allowed" }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  CheckLogin: function(data) {
    return new Promise((resolve, reject) => {
      schema.find(
        {
          email: data.email,
          Verified: true,
          password: data.password,
          Status: "offline"
        },
        function(err, res) {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  FindLogin: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: data.email }, { Login: 1 }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  UpdateStatusVerified: function(data) {
    return new Promise((resolve, reject) => {
      schema.update({ _id: data.id }, { $set: { Verified: true } }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  CreateRegister: function(data) {
    return new Promise((resolve, reject) => {
      schema.create(
        {
          username: data.username,
          email: data.email,
          mobileno: data.mobileno,
          password: data.password,
          Status: "offline",
          Verified: false,
          Login: "Allowed"
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  // find: function(data) {
  //   return new Promise((resolve, reject) => {
  //     schema.find({ username: data.Username }, { _id: 1 }, function(err, res) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(res);
  //       }
  //     });
  //   });
  // },
  ChangeStatus: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema.update(
        { email: data.email },
        { $set: { Status: "offline" } },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  ChangeStatus1: function(data) {
    return new Promise((resolve, reject) => {
      schema.update({ email: data }, { $set: { Status: "online" } }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  find: function(data) {
    return new Promise((resolve, reject) => {
      schema.find({ email: data.Username }, { _id: 1, Status: 1 }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  // Findss: function(data) {
  //   return new Promise((resolve, reject) => {
  //     schema.find({ username: data.Username }, function(err, res) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(res);
  //       }
  //     });
  //   });
  // },
  // Findss: function(data) {
  //   return new Promise((resolve, reject) => {
  //     schema.find({ email: data.Username }, function(err, res) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(res);
  //       }
  //     });
  //   });
  // },
  Finds: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.find({ member1id: data.myid, member2id: data1 }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  Finds1: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.find({ member2id: data.myid, member1id: data1 }, function(
        err,
        res
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  PushUser: function(data) {
    return new Promise((resolve, reject) => {
      schema3.update(
        { GroupRoom: data.GroupRoom },
        { $push: { GroupUser: { $each: data.GoupUser } } },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  SaveMessage: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.create(
        {
          member1id: data.myid,
          member2id: data1,
          Message: {
            Messagefrom: data.OwnUsername,
            Messages: data.Message,
            Time: data.Time
          }
        },
        { _id: 1 },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  UpdateMessages: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.update(
        {
          member1id: data.myid,
          member2id: data1
        },
        {
          $push: {
            Message: [
              {
                Messagefrom: data.OwnUsername,
                Messages: data.Message,
                Time: data.Time
              }
            ]
          }
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  UpdateMessages1: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.update(
        {
          member2id: data.myid,
          member1id: data1
        },
        {
          $push: {
            Message: [
              {
                Messagefrom: data.OwnUsername,
                Messages: data.Message,
                Time: data.Time
              }
            ]
          }
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  UpdateMessageSeen1: function(data, data1, data2) {
    return new Promise((resolve, reject) => {
      schema1.update(
        { member2id: data, member1id: data1 },
        { $set: { "Message.$[elem].Seen": "yes" } },
        { multi: true, arrayFilters: [{ "elem.Messagefrom": data2 }] },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  UpdateMessageSeen: function(data, data1, data2) {
    return new Promise((resolve, reject) => {
      schema1.update(
        { member1id: data, member2id: data1 },
        { $set: { "Message.$[elem].Seen": "yes" } },
        { multi: true, arrayFilters: [{ "elem.Messagefrom": data2 }] },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  FindAllMesg: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.find(
        {
          member1id: data,
          member2id: data1
        },
        function(err, res) {
          if (err) {
            console.log("Error");
            reject(err);
          } else {
            console.log("Resolved");
            resolve(res);
          }
        }
      );
    });
  },
  FindAllMesg1: function(data, data1) {
    return new Promise((resolve, reject) => {
      schema1.find(
        {
          member2id: data,
          member1id: data1
        },
        function(err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
};
