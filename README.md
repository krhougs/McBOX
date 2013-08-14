McBOX
=====

Web manager for MineCraft Bukkit Servers


#McBOX部署方法
###网页端
####需求
    Ruby 1.9.3或2.0.0
    MongoDB 2.4及以上
####Ruby环境搭建
######Windows
使用[RailsInstaller](http://www.railsinstaller.org/en)

######Linux
更新系统以及缓存

    # run as root!
    apt-get update -y
    apt-get upgrade -y
    apt-get install sudo -y

安装依赖包

    sudo apt-get install -y build-essential zlib1g-dev libyaml-dev libssl-dev libgdbm-dev libreadline-dev libncurses5-dev libffi-dev curl git-core openssh-server redis-server checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev

下载、编译、安装Ruby

    mkdir /tmp/ruby && cd /tmp/ruby
    curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p247.tar.gz | tar xz
    cd ruby-2.0.0-p247
    ./configure
    make
    sudo make install

安装Bundler Gem

    sudo gem install bundler --no-ri --no-rdoc
    
####部署McBOX
1. 将其解压至任意目录
2. 安装依赖Gem `bundle install`
3. 修改配置文件`config/config.json`和`config/database.yml`
4. 使用`rackup`命令将应用跑起

###控制端
使用`Remote Toolkit`和`JSONAPI`