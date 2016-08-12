const request = require('request');
const baseUrl = 'https://api.github.com/';

module.exports = {
  searchUser: searchUser,
  userDetail: userDetail,
};

function searchUser(req, res){
  if (!req.body.username || req.body.username === ''){
    res.status(400).render('error', {message: 'No username received!'})
  }
  let query = baseUrl + 'search/users?q=' + req.body.username + '+in%3Alogin&type=Users';
  githubRequest(query)
    .then((val) => {
      let searchResults = {
        total: val.body.total_count,
        list: val.body.items,
      };
      res.status(200).render('userlist', searchResults);
    })
    .catch((err) => {
      res.status(500).render('error', {message: 'Please try again later...'});
    });
}

function userDetail(req, res){
  let username = req.params.username;
  let query = baseUrl + 'users/' + username + '/repos';
  githubRequest(query)
    .then((val) => {
      collectLanguages(val.body, username, (err, body) => {
        if(err) {
          console.log(err);
          res.status(400).render('error', {message: 'Something went wrong!'});
        }
        else{
          res.status(200).render('userdetail', body);
        }
      });
    })
    .catch((err) => {
      res.status(500).render('error', {messag: 'Please try again later...'});
    });

}

function collectLanguages(repos, username, done){
  let arr = [];
  let query = baseUrl + 'repos/' + username;
  repos.forEach((repo) => {
    arr.push(githubRequest(query + '/' + repo.name + '/languages', repo.name));
  });
  Promise
    .all(arr)
    .then((val) => {
      let langs = {};
      val.forEach((item) => {
        for (let key in item.body){
          if(!langs[key]){
            langs[key] = Number(item.body[key]);
          }else{
            langs[key] += Number(item.body[key]);
          }
        }
      });
      let favoLang = null;
      for (let key in langs){
        if (favoLang === null){
          favoLang = key;
        } else if (langs[favoLang] < langs[key]){
          favoLang = key;
        }
      }
      let result = {
        langs: langs,
        favoLang: favoLang,
        list: val
      };
      return done(null, result);
    })
    .catch((err) => {
      return done(err, null);
    })
}

function githubRequest(query, arg){
  return new Promise((resolve, reject) => {
    let headers = {
      'User-Agent': 'RoelandDS'
    };

    request({
      headers: headers,
      uri: query,
      method: 'GET'
    }, (err, response, body) => {
      if (err) return reject(err);
      else {
        console.log(response.statusCode);
        if (response.statusCode === 200){
          let result = {};
          result.arg = arg ? arg : null;
          result.body = JSON.parse(body);
          return resolve(result);
        } else {
          return reject(response.headers);
        }
      }
    });
  })
}

