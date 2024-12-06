import debounce from 'lodash.debounce';

const syncProducts = debounce(async () => {
  // Fetch data logic here
}, 300); // Trigger every 300ms
