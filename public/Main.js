const {app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { execSync } = require('child_process');
const protobuf = require('protobufjs');

let win;

const schema = `
syntax = "proto3";

message Family {
    string relation = 1;
    string name = 2;
}

message User {
    string key = 1;
    string name = 2;
    string address = 3; 
    repeated Family family = 4; 
    string phone = 5; 
    string etc = 6; 
}

message Data { 
    string password = 1; 
    string lastmodified = 2;      
    repeated User userList = 3;  
}
`;

const targetFileName = 'UserManagement.bin';

function createWindow() {
    /*
    * 넓이 1920에 높이 1080의 FHD 풀스크린 앱을 실행시킵니다.
    * */
    win = new BrowserWindow({
        width:1920,
        height:1080,
        frame: true,
        // icon: path.join(__dirname, '/../build/icon.jpg'),
        webPreferences: {
            nodeIntegration: true, // Node.js 사용 허용
            enableRemoteModule: true,
            contextIsolation: true, // 필수 옵션
            title: "유저관리도구",
            preload: path.join(__dirname, '/../build/preload.js')
        },
    });

    /*
    * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
    * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
    * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
    * */
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    /*
    * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
    * */
    win.loadURL(startUrl);

    win.on('closed', () => {
        win = null;
    });

        
    // 개발자 도구 열기
    // win.webContents.openDevTools();

}

//mac
// const getUsbDrives = () => {
//   try {
//       // `/Volumes` 디렉토리에서 마운트된 USB 드라이브 찾기
//       const volumesOutput = execSync('ls /Volumes').toString();
//       return volumesOutput
//           .split('\n')
//           .filter(name => name.trim()) // 빈 라인 제거
//           .map(name => `/Volumes/${name}`); // 전체 경로로 변환
//   } catch (error) {
//       console.error('Error fetching USB drives:', error);
//       return [];
//   }
// };

//win
const getUsbDrives = () => {
  try {
      // `wmic logicaldisk` 명령으로 드라이브 정보 가져오기
      const output = execSync('wmic logicaldisk get caption,description').toString();
      const lines = output.split('\n').slice(1);

      // USB 드라이브 필터링 (Removable Disk)
      const usbDrives = lines
          .map(line => line.trim().split(/\s{2,}/)) // 공백으로 분리
          .filter(parts => parts[1] && parts[1].includes('Removable Disk')) // USB인지 확인
          .map(parts => parts[0]); // 드라이브 문자 반환

      return usbDrives;
  } catch (error) {
      console.error('Error fetching USB drives:', error);
      return [];
  }
}

const findFileInUsb = (driveLetters, fileName) => {
    for (const drive of driveLetters) {
      //mac: const drivePath = `${drive}/`; // 드라이브 경로
      //win: const drivePath = `${drive}\\`; // 드라이브 경로
        const drivePath = `${drive}\\`; // 드라이브 경로
        try {
            const files = fs.readdirSync(drivePath); // 드라이브 내부 파일 읽기
            if (files.includes(fileName)) {
                return path.join(drivePath, fileName); // 파일 경로 반환
            }
        } catch (error) {
            console.error(`Error accessing drive ${drivePath}:`, error);
        }
    }
    return null;
}


app.on('ready', createWindow);


ipcMain.handle('check-usb', async(event)=>{
  const usbDrives = getUsbDrives();
  if (usbDrives.length === 0) {
      return null;
  }

  // console.log('Detected USB Drives:', usbDrives);
  const targetFilePath = findFileInUsb(usbDrives, targetFileName);
  if(targetFilePath){
    return targetFilePath
  }else {
    return null;
  }
})

ipcMain.handle('get-usb-data', async (event, inputData) => {
    const root = protobuf.parse(schema).root;
    const {localPath, localPass} = inputData

    // 메시지 타입 가져오기
    const USBData = root.lookupType("Data");


      // 데이터 역직렬화
    const loadedBuffer = fs.readFileSync(localPath);
    const decoded = USBData.decode(loadedBuffer);
    const decodedObject = USBData.toObject(decoded);


    if (String(localPass) === String(decodedObject.password)){
        return {success: true, content: decoded}
    }else{
      return {success: false, msg: '비밀번호가 틀림'}
    }

      
});

ipcMain.handle('set-usb-data', async (event, inputData) => {
    const { password, userList } = inputData;
    const savePath = app.getPath("downloads");

    // 컴파일 및 데이터 직렬화
    try {
      const root = protobuf.parse(schema).root;
  
      // 메시지 타입 가져오기
      const USBData = root.lookupType("Data");
  
      // 데이터 정의
      const data = {
          password: password, // inputData는 외부에서 제공받는 값
          userList: userList
      };
  
      // 데이터 검증
      const errMsg = USBData.verify(data);
      if (errMsg) {
          return {success: false, msg: `Validation Error: ${errMsg}`};
      }
  
      // 데이터 직렬화
      const buffer = USBData.encode(data).finish();
  
      // 직렬화된 데이터를 파일로 저장
      fs.writeFileSync(path.join(savePath, targetFileName), buffer);
  
      console.log(`Data serialized successfully to ${targetFileName}`);
      return {success: true};
  } catch (err) {
    return {success: false, msg: err};
  }
});

// 특정 이름의 쿠키 가져오기
ipcMain.handle('get-cookie-by-name', async (event, cookieName) => {
    try {
      // 모든 쿠키 가져오기
        const cookies = await session.defaultSession.cookies.get({});
      // 이름으로 필터링
        const targetCookie = cookies.find(cookie => cookie.name === cookieName);
      return targetCookie || null; // 쿠키가 없으면 null 반환
    } catch (error) {
        console.error('Failed to get cookie by name:', error);
        return null; // 에러 시 null 반환
    }
});

ipcMain.handle('set-cookie-by-name', async (event, cookie) => {
    try {
      // 쿠키 설정
      await session.defaultSession.cookies.set({
        url: 'http://localhost', // 반드시 URL 필요
        name: cookie.name,         // 쿠키 이름
        value: cookie.value,       // 쿠키 값
        path: '/',                 // 경로 설정 (필수)
        expirationDate: Math.floor(Date.now() / 1000) + 3600, // 만료 시간 (1시간 뒤)
      });
      return 'Cookie set successfully';
    } catch (error) {
      console.error('Failed to set cookie:', error);
      return 'Error setting cookie';
    }
  });

  ipcMain.handle('delete-cookie-by-name', async (event, cookieName) => {
    try {
      // 모든 쿠키 가져오기
      const cookies = await session.defaultSession.cookies.get({});
      const targetCookie = cookies.find(cookie => cookie.name === cookieName);
  
      if (targetCookie) {
        // 정확한 URL 생성
        const cookieUrl = `http${targetCookie.secure ? 's' : ''}://${targetCookie.domain}${targetCookie.path}`;
  
        // 쿠키 삭제
        await session.defaultSession.cookies.remove(cookieUrl, targetCookie.name);
        return true;
      } else {
        return false; // 쿠키를 찾을 수 없음
      }
    } catch (error) {
      console.error('Failed to delete cookie:', error);
      return false;
    }
  });