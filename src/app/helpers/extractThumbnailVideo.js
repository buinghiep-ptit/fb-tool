export const importFileandPreview = (file, revoke) => {
  return new Promise((resolve, reject) => {
    window.URL = window.URL || window.webkitURL
    let preview = window.URL.createObjectURL(file)
    // remove reference
    if (revoke) {
      window.URL.revokeObjectURL(preview)
    }
    setTimeout(() => {
      resolve(preview)
    }, 100)
  })
}

export const generateVideoThumbnails = async (
  videoFile,
  numberOfThumbnails,
) => {
  let thumbnail = []
  let fractions = []
  return new Promise(async (resolve, reject) => {
    if (!videoFile.type?.includes('video')) reject('not a valid video file')
    await getVideoDuration(videoFile).then(async duration => {
      for (let i = 0; i <= duration; i += duration / numberOfThumbnails) {
        fractions.push(Math.floor(i))
      }
      let promiseArray = fractions.map(time => {
        return getVideoThumbnail(videoFile, time)
      })
      // console.log('promiseArray', promiseArray)
      // console.log('duration', duration)
      // console.log('fractions', fractions)
      await Promise.all(promiseArray)
        .then(res => {
          res.forEach(res => {
            // console.log('res', res.slice(0,8))
            thumbnail.push(res)
          })
          // console.log('thumbnail', thumbnail)
          resolve(thumbnail)
        })
        .catch(err => {
          console.error(err)
        })
        .finally(res => {
          console.log(res)
          resolve(thumbnail)
        })
    })
    reject('something went wront')
  })
}

const getVideoThumbnail = (file, videoTimeInSeconds) => {
  return new Promise((resolve, reject) => {
    if (file.type.match('video')) {
      importFileandPreview(file).then(urlOfFIle => {
        var video = document.createElement('video')
        var timeupdate = function () {
          if (snapImage()) {
            video.removeEventListener('timeupdate', timeupdate)
            video.pause()
          }
        }
        video.addEventListener('loadeddata', function () {
          if (snapImage()) {
            video.removeEventListener('timeupdate', timeupdate)
          }
        })
        var snapImage = function () {
          var canvas = document.createElement('canvas')
          canvas.width = video.videoWidth / 4
          canvas.height = video.videoHeight / 4
          canvas
            .getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height)
          var image = canvas.toDataURL()
          var success = image.length > 100000 / 4
          if (success) {
            URL.revokeObjectURL(urlOfFIle)
            resolve(image)
          }
          return success
        }
        video.addEventListener('timeupdate', timeupdate)
        video.preload = 'metadata'
        video.src = urlOfFIle
        // Load video in Safari / IE11
        video.muted = true
        video.playsInline = true
        video.currentTime = videoTimeInSeconds
        video.play()
      })
    } else {
      reject('file not valid')
    }
  })
}

export const getVideoDuration = videoFile => {
  return new Promise((resolve, reject) => {
    if (videoFile) {
      if (videoFile.type.match('video')) {
        importFileandPreview(videoFile).then(url => {
          let video = document.createElement('video')
          video.addEventListener('loadeddata', function () {
            resolve(video.duration)
          })
          video.preload = 'metadata'
          video.src = url
          // Load video in Safari / IE11
          video.muted = true
          video.playsInline = true
          video.play()
          //  window.URL.revokeObjectURL(url);
        })
      }
    } else {
      reject(0)
    }
  })
}

const convertBase64 = imageFile => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imageFile)
    fileReader.onload = fileReaderEvent => {
      const imageAsBase64 = fileReaderEvent.target.result
      resolve(imageAsBase64)
    }
  })
}

const blobToFile = (theBlob, fileName) => {
  return new File(
    [theBlob], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    },
  )
}

export const compressImageFile = async (
  imageFile,
  maxWidth = 400,
  maxHeight = 350,
) => {
  return new Promise(resolve => {
    convertBase64(imageFile).then(imageAsBase64 => {
      let img = new Image()
      img.src = imageAsBase64
      img.onload = async () => {
        let canvas = document.createElement('canvas')
        const MAX_WIDTH = maxWidth
        const MAX_HEIGHT = maxHeight
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const blob = await fetch(canvas.toDataURL()).then(res => res.blob())

        const fileCompressed = blobToFile(blob, 'thumbnail.jpeg')

        resolve(fileCompressed)
      }
    })
  })

  // const imageResizeWidth = 100
  // // if (image.width <= imageResizeWidth) {
  // //  return;
  // // }

  // const canvas = document.createElement('canvas')
  // canvas.width = imageResizeWidth
  // canvas.height = ~~(image.height * (imageResizeWidth / image.width))
  // const context = canvas.getContext('2d', { alpha: false })
  // // if (!context) {
  // //  return;
  // // }
  // context.drawImage(image, 0, 0, canvas.width, canvas.height)

  // // const resizedImageBinary = canvas.toBlob()
  // const resizedImageAsBase64 = canvas.toDataURL(mimeType)
  // console.log('resizedImageAsBase64:', image.height)
  // return resizedImageAsBase64
  // }
}
