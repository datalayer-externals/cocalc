###
Jupyter Notebook

CoCalc: Collaborative web-based calculation
Copyright (C) 2017, Sagemath Inc.

AGPLv3
###

require('coffee-cache').setCacheDir("#{process.env.HOME}/.coffee/cache")

misc = require('smc-util/misc')
smc_react = require('../../smc-react')
require('../../project_store')  # needed so that project store is available.

project_id = '197cebae-6410-469a-8299-54498e438f51'
path       = 'path.ipynb'
redux_name = smc_react.redux_name(project_id, path)

exports.setup = (cb) ->
    # ensure project store is initialized, so can test file menu.
    smc_react.redux.constructor()  # this instantly resets the state of all redux
    smc_react.redux.getProjectStore(project_id)

    # Initialize/reset the testing client that the synctables connect to.
    {webapp_client} = require('../../webapp_client')
    global.webapp_client = webapp_client
    webapp_client.reset()

    # initialize actions/store
    actions = new (require('../project-actions').JupyterActions)(redux_name, smc_react.redux)
    store   = new (require('../store').JupyterStore)(redux_name, smc_react.redux)

    base = misc.separate_file_extension(path).name
    syncdb_path = misc.meta_file(base, 'ipython')
    syncdb = webapp_client.sync_db
        project_id      : project_id
        path            : syncdb_path
        change_throttle : 0
        save_interval   : 0
        primary_keys    : ['type', 'id']
        string_cols     : ['input']
        cursors         : true

    actions._init(project_id, path, syncdb, store, webapp_client)

    syncdb.once 'init', (err) =>
        if err
            cb(err)
        else
            actions._syncdb_change()
            actions.ensure_there_is_a_cell()
            cb(undefined, actions)

    # Cause the syncstring to be initialized so that the above 'init' happens.
    webapp_client.user_query
        query :
            syncstrings :
                project_id : project_id
                path       : syncdb_path
                init       : {time: new Date()}

exports.teardown = (cb) ->
    smc_react.redux.getActions(redux_name)?.close()
    smc_react.redux.removeProjectReferences(project_id)
    smc_react.redux.constructor()  # this instantly resets the state of all redux
    webapp_client.reset()
    cb()
