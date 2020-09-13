const functions = require('firebase-functions');

const gm = require('gm').subClass({imageMagick: true});
const {Storage} = require('@google-cloud/storage');
const fs = require('fs')
// const bodyParser = require('body-parser')

const runtimeOpts = {
  timeoutSeconds: 60,
  memory: '1GB'
}


const bucketName = "big-toe-game-cc-pic"
const storage = new Storage();

background_colors = [
  '#6565c3',
  '#cd4e52',
  '#448f2d',
  '#ee6c30',
];

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createImage = functions.region('australia-southeast1').runWith(runtimeOpts).https.onCall(async (data, context) => {
  if (!data.prompts || !data.gameId) {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
          'one arguments "text" containing the message text to add.');
  }

  const prompts = data.prompts;
  const gameId = data.gameId;


  await Promise.all(prompts.map(async (prompt, index) => {
      try {
          return generateImage(gameId, prompt, index).then(
              ((filePath) => {
                  return saveToBucket(gameId, `${gameId}-${index}.jpg`)
              })
          )
      } catch (e) {
          console.error(e)
      }
  }));


  return 'done';
});


function generateImage(gameId, prompt_text, prompt_id) {
  const bgColor = randomColor()
  return new Promise( (resolve, reject) => {
    gm(1920, 1080, bgColor)
      // .fontSize(100)
      .out('-size', '1800x800', '-background', bgColor, '-fill', 'white', '-gravity', 'center', '-pointsize', '80', `caption: ${prompt_text}`)
      .out('-composite')
      // .drawText(10, 50, "$NAME play 5 rounds of MR and MRS with $NAME (players sit back to back and are asked 5 questions, one question is one round. a question begins with “who is most likely to”, “who is the most” etc. Each player raises their hand if it’s them or lowers it if it’s the other person. Any discrepancy between the two players is one drink each.)", 'Center')
      .write(`/tmp/${gameId}-${prompt_id}.jpg`, function (err, stdout) {
          if (err) {
            console.error('Failed to create image.', err);
            reject(err);
          } else {
            console.log(`Created image`);
            // console.log(`To ${__dirname}`)
            resolve(`/tmp/${gameId}-${prompt_id}.jpg`);
          }
        }
      )});

}

async function saveToBucket(gameId, fileName) {
  const bucket = storage.bucket(bucketName);
  const gcsPath = `gs://${bucketName}/${fileName}`

  try {
    await bucket.upload(`/tmp/${fileName}`, {destination: `${gameId}/${fileName}`});
    console.log(`Uploaded blurred image to: ${gcsPath}`);
  } catch (err) {
    throw new Error(`Unable to upload  image to ${gcsPath}: ${err}`);
  } finally {
    fs.unlinkSync(`/tmp/${fileName}`)
  }

}

function randomColor() {
  return background_colors[Math.floor(Math.random() * background_colors.length)]
}
