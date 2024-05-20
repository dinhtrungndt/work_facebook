const axios = require('axios');
const uniqid = require('uniqid');

const generateAuthURL = (config={}) => {
    return new Promise((resolve,reject)=>{
      let {state, fbAppID, redirectURI, scopes} = config
      if (!state) {
        state = uniqid()
      }
      if (!fbAppID) {
        reject({error: "FB App ID is required."})
      }
      if (!redirectURI) {
        reject({error: "Redirect URI is required."})
      }
      if (scopes.length === 0) {
        reject({error: "scope cannot be empty."})
      }
      let authURL = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${fbAppID}&redirect_uri=${redirectURI}&state=${state}&scope=${scopes.join()}`
      resolve(authURL)
    })
}

const getAccessToken = (config={}) => {
    return new Promise((resolve, reject) => {
      const { code, fbAppID, fbAppSecret, redirectURI} = config
      if (!code) {
        reject({error:"Auth code is required."})
      }
      if (!fbAppID) {
        reject({error:"FB App ID is required."})
      }
      if (!fbAppSecret) {
        reject({error:"FB App secret is required."})
      }
      if (!redirectURI) {
        reject({error: "Redirect URI is required."})
      }
      axios.get(
            `https://graph.facebook.com/v7.0/oauth/access_token?code=${code}&client_id=${fbAppID}&client_secret=${fbAppSecret}&redirect_uri=${redirectURI}`
        ).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error.response.data)
        })
    })
}

const getLongLivedAccessToken = (config={}) => {
  return new Promise((resolve,reject)=>{
    const {fbAppID, fbAppSecret, accessToken} = config
    if (!fbAppID) { reject({error: "FB App ID is required."}) }
    if (!fbAppSecret) { reject({error: "FB App Secret is required."}) }
    if (!accessToken) { reject({error: "Access Token is required."}) }

    axios.get(`https://graph.facebook.com/v7.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${fbAppID}&client_secret=${fbAppSecret}&fb_exchange_token=${accessToken}`).then(response=>{
      resolve(response.data)
    }).catch(error=>{
      reject(error.response)
    })
  })
}

const getUserProfile = (config={}) => {
  return new Promise((resolve, reject) => {
    const {accessToken,fields} = config
    if (!accessToken) {
      reject({error:"Access Token is required."}) 
    }
    if (fields.length === 0) {
      reject({error:"Fields cannot be empty"})
    }
    axios
      .get(
          `https://graph.facebook.com/v7.0/me?fields=${fields.join()}&access_token=${accessToken}`
      )
      .then((response) => {
          resolve(response.data);
      })
      .catch((error) => {
          reject(error.response);
      });
  });
}

module.exports = { generateAuthURL, getAccessToken, getLongLivedAccessToken, getUserProfile }