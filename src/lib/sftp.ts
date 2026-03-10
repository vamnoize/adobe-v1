import Client from 'ssh2-sftp-client';

export interface SftpConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
}

export async function uploadToAdobeStock(config: SftpConfig, files: {name: string, buffer: Buffer}[]) {
  const sftp = new Client();
  
  if (config.host === "sftp.test.mock") {
    console.log("Mocking SFTP upload for testing.", files.map(f => f.name));
    return;
  }

  try {
    console.log(`Connecting to SFTP: ${config.host}`);
    await sftp.connect({
       host: config.host,
       port: config.port || 22,
       username: config.username,
       password: config.password,
    });

    for (const file of files) {
       console.log(`Uploading file ${file.name} (${file.buffer.length} bytes) to SFTP...`);
       await sftp.put(file.buffer, `./${file.name}`);
    }
    console.log("SFTP Upload complete.");
  } catch (error) {
     console.error("SFTP Upload Error", error);
     throw error;
  } finally {
    await sftp.end();
  }
}
