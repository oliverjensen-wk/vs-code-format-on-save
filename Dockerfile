FROM amazonlinux:2

WORKDIR /usr/src/extension

COPY . .

RUN yum install -y \
    gzip \
    tar && \
    rm -rf /var/cache/yum

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash && \
    . ~/.nvm/nvm.sh && \
    nvm install node && \
    npm install yarn -g && \
    yarn install  && \
    yarn compile && \
    yarn lint

USER nobody
