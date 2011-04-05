# mailcatchered: Start mailcatcher in a screen session
mailcatcherd() {
  local check=`screen -list|grep mailcatcher|awk '{print $1}'`
  if [[ "$1" = "" ]]; then

    local hostname=""
    
    if [[ $hostname = "" ]]; then 
      hostname='localhost'
    fi

    
    if [[ "${check}" = "" ]]; then
      screen -dmS mailcatcher mailcatcher
      echo "Started mailcatcher in background"
      open "http://${hostname}:1080"      
    else
      echo "mailcatcher is running in background..."
                  
      read -ep "re-attach(y/n) or run(r)?" choice
      if [[ $choice = [yY] ]]; then
        echo "Attaching mailcatcher session..."
        screen -r $check
      elif [[ $choice = [rR] ]]; then
        open "http://${hostname}:1080"
      else
        echo "mailcatcher currently running at ${check}"
      fi
    fi
  else
    if [[ $1 -eq "load" ]]; then
      screen -r mailcatcher
    fi
  fi
}
