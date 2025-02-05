Data Directory
==============

When AUViewer is being used to visualize ad-hoc data, a data directory
(including database) is *not* required. In all other cases, a data directory
is required.

The data directory is specified either as a function parameters (e.g. when used
as a Python module) or as a command-line argument (when starting the web server
via command line).

The data directory will contain project files, templates, config, and the
database. The directory may be initially empty or pre-populated with some
data according to the structure below. The organization of the directory
is as follows, and assets will be created by AUViewer as needed if they
do not already exist:

* config
    * *config.json*
* database
    * *db.sqlite*
* global_templates
    * *interface_templates.json*
    * *project_template.json*
* projects
    * \[project name\]
        * originals
        * processed
        * templates
            * *interface_templates.json*
            * *project_template.json*
