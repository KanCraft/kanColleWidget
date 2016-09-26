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

function TwitterPostWithImage(message) {
  const params = {
    image:  message.image,
    status: message.status,
    type:   message.type,
  };
  return new Promise((resolve, reject) => {
    Twitter.sharedInstance().postWithImage(params).then(response => {
      resolve({
        permalink: response.entities.media.pop().expanded_url.replace(/\/photo\/[0-9]+$/, '')
      });
    }).catch(error => {
      reject(error || {status: 500});
    })
  });
}

export {
  TwitterProfile,
  TwitterAuth,
  TwitterPostWithImage,
};
