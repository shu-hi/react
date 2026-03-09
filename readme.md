myenv上のmy-app下で nohup npm run dev -- -H 0.0.0.0 > react.log 2>&1 &
nginx-reactを同ディレクトリでdocker-compose up --build -d 
これ用のconfで立ち上がる

バックエンドはfastapi(pandas)->githubのsnippet

使っているのは
react:vercel
fastapi:render
postgress:supabase
keepalive:UptimeRobot