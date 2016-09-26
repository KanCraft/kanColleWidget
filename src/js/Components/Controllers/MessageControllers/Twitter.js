import Twitter from '../../Services/Twitter';

function TwitterProfile(message) {
  return new Promise((resolve, reject) => {
    Twitter.sharedInstance().getProfile().then(profile => {
      resolve(profile);
    }).catch(error => {
      reject({status: 404});
    });
  });
}

function TwitterAuth(message) {
  return Twitter.sharedInstance().auth().then(TwitterProfile);
}

export {
  TwitterProfile,
  TwitterAuth,
};
