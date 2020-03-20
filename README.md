## 2019 ICE Senior Project - Patent Translator

## Quick start

To quickly install and fire-up OFBiz, please follow the below instructions
from the command line at the OFBiz top level directory (folder)

### Download the Gradle wrapper:

MS Windows:
`init-gradle-wrapper.bat`

Unix-like OS:
`./gradle/init-gradle-wrapper`

### Prepare OFBiz:

> _Note_: Depending on your Internet connection speed it might take a long
> time for this step to complete if you are using OFBiz for the first time
> as it needs to download all dependencies. So please be patient!

MS Windows:
`gradlew cleanAll loadAll`

Unix-like OS:
`./gradlew cleanAll loadAll`

### Start OFBiz:

MS Windows:
`gradlew ofbiz`

Unix-like OS:
`./gradlew ofbiz`

### Visit OFBiz through your browser:

[Order Back Office](https://localhost:8443/ordermgr)

[Accounting Back Office](https://localhost:8443/accounting)

[Administrator interface](https://localhost:8443/webtools)

You can log in with the user **admin** and password **ofbiz**.
