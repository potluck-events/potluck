class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = True
