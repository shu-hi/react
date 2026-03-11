sudo apt update
 curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y
npm install -g create-react-app
npm install dotenv
myenv上のmy-app下で nohup npm run dev -- -H 0.0.0.0 > react.log 2>&1 &
nginx-reactを同ディレクトリでdocker-compose up --build -d 
これ用のconfで立ち上がる

バックエンドはfastapi(pandas)->githubのsnippet

使っているのは
react:vercel
fastapi:render
postgress:supabase
keepalive:UptimeRobot
