FROM cypress/browsers:node14.16.0-chrome90-ff88

WORKDIR /app

RUN apt update && apt upgrade -y
RUN apt install default-jre -y
ENV CI=1
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

RUN echo "whoami: $(whoami)"
RUN npm config -g set user $(whoami)

ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress
RUN npm install -g "cypress@8.1.0"
RUN cypress verify

COPY . /app

RUN npm install
RUN npm install --save-dev "cypress@8.2.0" cypress-multi-reporters mocha mochawesome mochawesome-merge mochawesome-report-generator cypress-mailosaur cypress-commands "@cypress/skip-test" cypress-localstorage-commands cypress-parallel eslint eslint-plugin-chai-friendly eslint-plugin-cypress "@shelex/cypress-allure-plugin" allure-commandline del cypress-xpath

RUN cypress cache path
RUN cypress cache list
RUN cypress info
RUN cypress version

RUN chmod 755 /root