FROM mcr.microsoft.com/azure-functions/python:4-python3.11

ENV AzureWebJobsScriptRoot=/home/site/wwwroot

COPY . /home/site/wwwroot

RUN pip install -r /home/site/wwwroot/requirements.txt
