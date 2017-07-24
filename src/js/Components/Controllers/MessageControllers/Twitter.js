import Twitter from "../../Services/Twitter";

function TwitterProfile(/* message */) {
  return new Promise((resolve, reject) => {
    Twitter.sharedInstance().getProfile().then(profile => {
      resolve(profile);
    }).catch(error => {
      reject({status: 404, error});
    });
  });
}

function TwitterAuth(/* message */) {
  return Twitter.sharedInstance().auth().then(TwitterProfile);
}

export function TwitterRevoke() {
  return Twitter.sharedInstance().clearTokens();
}

export function GetKanColleSTAFFTweets() {
  return Twitter.sharedInstance().getKanColleSTAFFTweets();
}

function TwitterPostWithImage(message) {
  const params = {
    image:  message.image,
    status: message.status,
    tags:   message.tags,
    type:   message.type,
    reply:  message.reply,
  };
  return new Promise((resolve, reject) => {
    Twitter.sharedInstance().postWithImage(params).then(response => {
      resolve({
        permalink: response.entities.media.pop().expanded_url.replace(/\/photo\/[0-9]+$/, "")
      });
    }).catch(error => {
      if (error.code) {
        return reject({status: error.code, message: error.message});
      }
      reject({status: 500, message: JSON.stringify(error)});
    });
  });
}

export {
  TwitterProfile,
  TwitterAuth,
  TwitterPostWithImage,
};
