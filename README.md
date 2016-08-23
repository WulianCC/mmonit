# Node MMonit

## Demo

```js
import mmonit from 'mmonit';

(async() => {
  const result = await mmonit({
    host: 'https://127.0.0.1:8080/',
    username: 'admin',
    password: 'admin'
  }, {
    state: 1
  });
  console.log(result);
})();
```
