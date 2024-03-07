FROM alpine:3.10

RUN apk add --no-cache python3-dev \
    && pip3 install --upgrade pip

WORKDIR /app

COPY . /app

RUN pip3 --no-cache-dir install -r requirements.txt
RUN pip3 install requests
RUN pip3 install python-dotenv
RUN pip3 install -U flask-cors

CMD ["python3","main.py"]