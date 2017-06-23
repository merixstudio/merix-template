@Library('shared')
import gd.mrx.ci.DockerStack

node {
    stage('Checkout') {
        checkout scm
    }

    def stack = new gd.mrx.ci.DockerStack(this, 'merix-template', [
        include_default_branch_in_hostname: false
    ])
    stack.execute()
}
