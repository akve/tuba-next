export DATA_PATH=$(pwd)/data
export CODE_PATH=$(pwd)
export NODE_ENV=development
export ENV=production
export DATA_INIT=yes
export DATA_MIGRATE=yes
export DISABLE_CACHE=yes
export NPM=yes
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_SPIN=false
export SECRET=norsk2019

docker-compose -f ./scripts/docker-compose.yml up
