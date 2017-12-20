@Library('shared@0.2')
import gd.mrx.ci.DockerStack

node('builder') {
    stage('Checkout') {
        checkout scm
    }
}

def stack = new gd.mrx.ci.DockerStack(this, 'merix-template', [
    include_default_branch_in_hostname: false
])

stack.execute()
