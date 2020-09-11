const functions = require('firebase-functions');

const gm = require('gm').subClass({imageMagick: true});
const {Storage} = require('@google-cloud/storage');
const fs = require('fs')
const bodyParser = require('body-parser')


const bucketName = "big-toe-game.appspot.com"
const storage = new Storage();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createImage = functions.region('australia-southeast1').https.onRequest((req, res) => {
  if (!req.body.prompts || !req.body.gameId) {
    return res.status(400).send('Missing params')
  }

  const prompts = req.body.prompts;
  const gameId = req.body.gameId;

  prompts.forEach(async (prompt, index) => {
    try {
      await generateImage(gameId, prompt, index)
      await saveToBucket(gameId, `${gameId}-${index}.jpg`)
    } catch (e) {
      console.error(e)
    }
  });


  res.sendStatus(200)
});


async function generateImage(gameId, prompt_text, prompt_id) {
  console.log('OPKLSSSSADASD')


  await new Promise( (resolve, reject) => {
    gm(1920, 1080, "#6565c3")
      // .fontSize(100)
      .out('-size', '1800x800', '-background', '#6565c3', '-fill', 'white', '-gravity', 'center', '-pointsize', '80', `caption: ${prompt_text}`)
      .out('-composite')
      // .drawText(10, 50, "$NAME play 5 rounds of MR and MRS with $NAME (players sit back to back and are asked 5 questions, one question is one round. a question begins with “who is most likely to”, “who is the most” etc. Each player raises their hand if it’s them or lowers it if it’s the other person. Any discrepancy between the two players is one drink each.)", 'Center')
      .write(`/tmp/pics/${gameId}-${prompt_id}.jpg`, function (err, stdout) {
          if (err) {
            console.error('Failed to create image.', err);
            reject(err);
          } else {
            console.log(`Created image`);
            // console.log(`To ${__dirname}`)
            resolve(stdout);
          }
        }
      )});

}

async function saveToBucket(gameId, fileName) {
  const bucket = storage.bucket(bucketName);
  const gcsPath = `gs://${bucketName}/${fileName}`

  try {
    await bucket.upload(`/tmp/pics/${fileName}`, {destination: `${gameId}/${fileName}`});
    console.log(`Uploaded blurred image to: ${gcsPath}`);
  } catch (err) {
    throw new Error(`Unable to upload  image to ${gcsPath}: ${err}`);
  }

}
