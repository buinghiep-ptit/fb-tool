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
      await Promise.all(promiseArray)
        .then(res => {
          res.forEach(res => {
            thumbnail.push(res)
          })
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

export const compressImageFile = async (imageFile, format) => {
  return new Promise(async resolve => {
    let originalImage = new Image()
    originalImage.src = await fileToDataUri(imageFile)

    originalImage.addEventListener('load', () => {
      compressImage(originalImage, format).then(file => resolve(file))
    })
  })
}

const compressImage = (
  imgToCompress,
  format = 'jpg',
  resizingFactor = 1,
  quality = 0.8,
) => {
  return new Promise(resolve => {
    const MAX_WIDTH = 640
    const MAX_HEIGHT = 480

    // showing the compressed image
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    let originalWidth = imgToCompress.width
    let originalHeight = imgToCompress.height

    if (originalWidth > originalHeight) {
      if (originalWidth * resizingFactor > MAX_WIDTH) {
        originalHeight *= MAX_WIDTH / originalWidth
        originalWidth = MAX_WIDTH
      }
    } else {
      if (originalHeight * resizingFactor > MAX_HEIGHT) {
        originalWidth *= MAX_HEIGHT / originalHeight
        originalHeight = MAX_HEIGHT
      }
    }

    const canvasWidth = originalWidth * resizingFactor
    const canvasHeight = originalHeight * resizingFactor

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    context.drawImage(
      imgToCompress,
      0,
      0,
      originalWidth * resizingFactor,
      originalHeight * resizingFactor,
    )

    // reducing the quality of the image
    canvas.toBlob(
      async blob => {
        if (blob) {
          const compressedBlobToFile = blobToFile(blob, 'compressed.' + format)

          resolve(compressedBlobToFile)
        }
      },
      'image/' + format,
      quality,
    )
  })
}

const fileToDataUri = field => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsDataURL(field)
  })
}

export const blobToFile = (theBlob, fileName) => {
  return new File(
    [theBlob], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    },
  )
}
