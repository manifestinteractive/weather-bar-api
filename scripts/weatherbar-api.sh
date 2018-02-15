#!/bin/bash
#
# description: Bash file to manage API Services
#
# author: Peter Schmalfeldt <hello@weatherbar.com>

DIR=`dirname $0`
APP_NAME="Weather Bar API"
PATH_API="$(dirname "$DIR")"

ARG1=1
ARG2=2

COMMAND=${!ARG1}
OPTION=${!ARG2}

API_PORT=5000

NX=""
ES=""
MS=""
NX=""
NS=""

__make_header(){
  TEXT=$( echo $1 | tr '\n' ' ')
  echo -e "\n\033[48;5;22m  Weather Bar › $TEXT  \033[0m\n"
}

__output(){
  TEXT=$( echo $1 | tr '\n' ' ')
  echo -e "\033[7m › \033[27m $TEXT\n"
}

__success(){
  TEXT=$( echo $1 | tr '\n' ' ')
  echo -e "\033[38;5;34m✓ Weather Bar › $TEXT\033[0m\n"
}

__notice(){
  TEXT=$( echo $1 | tr '\n' ' ')
  echo -e "\033[38;5;220m→ Weather Bar › $TEXT\033[0m\n"
}

__error(){
  TEXT=$( echo $1 | tr '\n' ' ')
  echo -e "\033[38;5;196m× Weather Bar › $TEXT\033[0m\n"
}

__confirm(){
  echo -ne "\n\033[38;5;220m⚠ Weather Bar › $1\033[0m"
}

function weatherbar_api(){
  case "$1" in
    install)
      weatherbar_api_install
    ;;
    start)
      weatherbar_service_check
      weatherbar_api_start
    ;;
    stop)
      weatherbar_service_check
      weatherbar_api_stop
    ;;
    restart)
      __error "You are about to restart the $APP_NAME."

      echo -ne "\33[38;5;196mCONTINUE? (y or n) : \33[0m"
      read CONFIRM
      case $CONFIRM in
        y|Y|YES|yes|Yes)
          weatherbar_api_stop
          weatherbar_api_start
        ;;
        n|N|no|NO|No)
          __notice "Skipping Restart of $APP_NAME"
        ;;
        *)
          __notice "Please enter only y or n"
      esac
    ;;
    reset)
      weatherbar_api_reset
    ;;
    update)
      weatherbar_api_update
    ;;
    migrate)
      weatherbar_api_migrate
    ;;
    seed)
      weatherbar_api_seed
    ;;
    status)
      weatherbar_service_check
      weatherbar_api_status
    ;;
    "-h" | "-help" | "--h" | "--help" | help)
      weatherbar_api_help
    ;;
    *)
      __error "Missing Argument | Loading Help ..."
      weatherbar_api_help
  esac
}

weatherbar_api_install() {
  __make_header "Installing $APP_NAME"

  # Change to Doing API Directory
  cd $PATH_API

  weatherbar_api_reset

  npm install
}

weatherbar_api_start() {
  __make_header "Starting $APP_NAME"

  # Change to Doing API Directory
  cd $PATH_API

  # Cleanup old log files
  rm -f *.log
  rm -f ~/.forever/web-server.log

  # Only start up supporting services on MacOS
  if [[ $OSTYPE == darwin* ]]; then
    if [[ -n $NX ]]; then
      __notice "Nginx Already Running"
    else
      __success "Starting Nginx"
      brew services start nginx
    fi

    if [[ -n $ES ]]; then
      __notice "Elasticsearch Already Running"
    else
      __success "Starting Elasticsearch"
      brew services start elasticsearch@1.7
    fi

    if [[ -n $MS ]]; then
      __notice "MySQL Already Running"
    else
      __success "Starting MySQL"
      brew services start mysql
    fi

    if [[ -n $RS ]]; then
      __notice "Redis Server Already Running"
    else
      __success "Starting Redis"
      brew services start redis
    fi
  fi

  # Start Node Service
  if [[ -n $NS ]]; then
    __notice "Node Server Already Running"
  else
    cd $PATH_API

     __success "Cleaning Up Junk Files"
    npm run -s cleanup

     __success "Generating API Docs"
    npm run -s docs

     __make_header "Migrating API Structure"
    npm run -s migrate

     __make_header "Seeding Database"
    npm run -s seed

     __make_header "Updating Search Index"
    npm run -s elasticsearch:create
    npm run -s elasticsearch:update

    if [ "$OPTION" == "debug" ]; then
      __make_header "Starting Node Server in Debug Mode"
      DEBUG=express:* ./node_modules/nodemon/bin/nodemon.js index.js
    else
      __make_header "Starting Node Server"
      forever start -w --watchDirectory ./ --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server.log -o ./web-server-stdout.log -e ./web-server-stderr.log index.js
    fi

  fi
}

weatherbar_api_stop() {
  __make_header "Stopping $APP_NAME"

  # Change to Doing API Directory
  cd $PATH_API

  # Only stop supporting services on MacOS
  if [[ $OSTYPE == darwin* ]]; then
    if [[ -n $NX ]]; then
      __confirm "Stopping Nginx. CONTINUE? (y or n): "
      read CONFIRM
      case $CONFIRM in
        y|Y|YES|yes|Yes)
          brew services stop nginx
        ;;
        n|N|no|NO|No)
        ;;
        *)
        __notice "Please enter only y or n"
      esac
    else
      __notice "Nginx was not Running"
    fi

    if [[ -n $ES ]]; then
      __confirm "Stopping Elasticsearch. CONTINUE? (y or n): "

      read CONFIRM
      case $CONFIRM in
        y|Y|YES|yes|Yes)
          cd $PATH_API
          npm run -s elasticsearch:delete
          brew services stop elasticsearch@1.7
        ;;
        n|N|no|NO|No)
        ;;
        *)
        __notice "Please enter only y or n"
      esac
    else
      __notice "Elasticsearch was not Running"
    fi

    if [[ -n $MS ]]; then
      __confirm "Stopping MySQL. CONTINUE? (y or n): "

      read CONFIRM
      case $CONFIRM in
        y|Y|YES|yes|Yes)
          brew services stop mysql
        ;;
        n|N|no|NO|No)
        ;;
        *)
        __notice "Please enter only y or n"
      esac
    else
      __notice "MySQL was not Running"
    fi

    if [[ -n $RS ]]; then
      __confirm "Stopping Redis Server. CONTINUE? (y or n): "

      read CONFIRM
      case $CONFIRM in
        y|Y|YES|yes|Yes)
          brew services stop redis
        ;;
        n|N|no|NO|No)
        ;;
        *)
        __notice "Please enter only y or n"
      esac
    else
      __notice "Redis Server was not Running"
    fi
  fi

  if [[ -n $NS ]]; then
    __success "Stopping Node Server"

    cd $PATH_API
    forever stop -w --watchDirectory ./ --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server.log -o ./web-server-stdout.log -e ./web-server-stderr.log index.js

    # kill Known Ports just in case
    lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9;
  else
    __notice "Node Server was not Running"
  fi

}

weatherbar_api_reset() {
  __make_header "Resetting $APP_NAME"

  # Change to Doing API Directory
  cd $PATH_API

  # Remove old NPM Modules to prevent weird issues
  rm -fr node_modules
}

weatherbar_api_update() {
  __make_header "Updating $APP_NAME"

  # Change to Doing API Directory
  cd $PATH_API

  weatherbar_api_stop

  __success "Updating Git Repo"
  git reset --hard
  git fetch
  git pull

  weatherbar_api_install
  weatherbar_api_start
}

weatherbar_api_migrate() {
  __make_header "Migrating $APP_NAME Database"

  cd $PATH_API
  npm run -s migrate
}

weatherbar_api_seed() {
  __make_header "Migrating $APP_NAME Database"

  cd $PATH_API
  npm run -s seed
}

weatherbar_api_status() {
  __make_header "$APP_NAME Status Check"

  if [[ -n $NX ]]; then
    __success "Nginx is Running"
  else
    __error "Nginx is Not Running"
  fi

  if [[ -n $ES ]]; then
    __success "Elasticsearch is Running"
  else
    __error "Elasticsearch is Not Running"
  fi

  if [[ -n $MS ]]; then
    __success "MySQL is Running"
  else
    __error "MySQL is Not Running"
  fi

  if [[ -n $RS ]]; then
    __success "Redis Server is Running"
  else
    __error "Redis Server is Not Running"
  fi

  if [[ -n $NS ]]; then
    __success "Node Server is Running"
  else
    __error "Node Server is Not Running"
  fi
}

weatherbar_service_check() {
  if [[ $OSTYPE == darwin* ]]; then
    NX=$(brew services list | grep nginx | awk '{print $2}' | grep started)
    ES=$(brew services list | grep elasticsearch@1.7 | awk '{print $2}' | grep started)
    MS=$(brew services list | grep mysql | awk '{print $2}' | grep started)
    RS=$(brew services list | grep redis | awk '{print $2}' | grep started)
    NS=$(lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}')
  else
    NX=$(systemctl status nginx | grep 'Main PID' | awk '{print $3}')
    ES=$(systemctl status elasticsearch | grep 'Main PID' | awk '{print $3}')
    MS=$(systemctl status mysql | grep 'Main PID' | awk '{print $3}')
    RS=$(systemctl status redis | grep 'Main PID' | awk '{print $3}')
    NS=$(lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}')
  fi
}

weatherbar_api_help() {
  __make_header "Instructions"

  echo -e "\033[38;5;34m$ weatherbar_api install\033[0m\n"

  echo "  Installs dependencies and NPM modules."

  echo -e "\n\033[38;5;34m$ weatherbar_api start\033[0m\n"

  echo "  Starts Elasticsearch, MySQL, Redis & Node Servers."

  echo -e "\n\033[38;5;34m$ weatherbar_api stop\033[0m\n"

  echo "  Stops Elasticsearch, MySQL, Redis & Node Servers."

  echo -e "\n\033[38;5;34m$ weatherbar_api restart\033[0m\n"

  echo -e "  Same as running \033[38;5;220m$ weatherbar_api stop\033[0m and then \033[38;5;220m$ weatherbar_api start\033[0m."

  echo -e "\n\033[38;5;34m$ weatherbar_api reset\033[0m\n"

  echo "  Resets Project to Clean Installation State."

  echo -e "\n\033[38;5;34m$ weatherbar_api update\033[0m\n"

  echo -e "  Pulls down latest Git Repo Changes and runs \033[38;5;220m$ weatherbar_api reset\033[0m."

  echo -e "\n\033[38;5;34m$ weatherbar_api migrate\033[0m\n"

  echo "  Updates to latest database schema."

  echo -e "\n\033[38;5;34m$ weatherbar_api seed\033[0m\n"

  echo "  Updates to latest database data."

  echo -e "\n\033[38;5;34m$ weatherbar_api status\033[0m\n"

  echo "  Prints the status of all running services."

  echo -e "\n\033[38;5;34m$ weatherbar_api help\033[0m\n"

  echo "  Prints this help screen."

  echo -e ""
}

weatherbar_api $1 $2
