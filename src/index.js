import app from './app.js';

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
