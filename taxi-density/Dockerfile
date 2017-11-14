FROM node:7.10.1-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

#RUN apt-get update
#RUN apt-get install nano net-tools
RUN npm install request cron mongojs

# Set timezone 
ENV TZ=Asia/Bangkok 
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set localhost 
RUN echo '127.0.0.1   localhost localhost.localdomain' >> /etc/hosts

EXPOSE 80

CMD [ "node" ,"app.js" ]
