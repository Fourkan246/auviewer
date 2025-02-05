'use strict';

/*
The RequestHandler is a global singleton that handles asynchronous API requests.
 */

// Class declaration
function RequestHandler() {}

RequestHandler.prototype.createAnnotation = function(project_id, file_id, left, right, seriesID, label, pattern_id, callback) {

	this._newRequest(callback, globalAppConfig.createAnnotationURL, {
		project_id: project_id,
		file_id: file_id,
		xl: left,
		xr: right,
		/*yt: ,
		yb: ,*/
		sid: seriesID,
		label: label,
		pattern_id: pattern_id
	});

};

RequestHandler.prototype.deleteAnnotation = function(id, project_id, file_id, callback) {
	this._newRequest(callback, globalAppConfig.deleteAnnotationURL, {
		id: id,
		project_id: project_id,
		file_id: file_id
	});
};

RequestHandler.prototype.featurize = function(project_id, file_id, series, featurizer, left, right, params, callback) {
	this._newRequest(callback, globalAppConfig.featurizeURL, {
		project_id: project_id,
		file_id: file_id,
		series: series,
		featurizer: featurizer,
		left: left,
		right: right,
		params: JSON.stringify(params)
	});
};
RequestHandler.prototype.updateThreshold = function(project_id, threshold_title, threshold_value, callback) {
	this._customRequest(callback, globalAppConfig.updateThresholdURL, {
		project_id: project_id
	},
	{
		'title': threshold_title,
		'value': threshold_value
	}, "PUT", true)
};

RequestHandler.prototype.previewThreshold = function(project_id, filesToPreview, labelerToPreview, thresholdsToPreview, timesegment, callback) {
	this._customRequest(callback, globalAppConfig.previewThresholdsURL, {
		project_id: project_id
	}, {
		files: filesToPreview,
		thresholds: thresholdsToPreview,
		labeler: labelerToPreview,
		time_segment: timesegment
	}, "POST", true)
};

RequestHandler.prototype.uploadCustomSegments = function(project_id, filePayload, callback) {
	this._customRequest(callback, globalAppConfig.uploadCustomSegmentsURL, {
		project_id: project_id
	},
	{
		file_payload: filePayload
	}, "POST");
};
RequestHandler.prototype.requestPatternDetection = function(project_id, file_id, type, seriesID, tlow, thigh, duration, persistence, maxgap, callback) {

	this._newRequest(callback, globalAppConfig.detectPatternsURL, {
		project_id: project_id,
		file_id: file_id,
		type: type,
		series: seriesID,
		thresholdlow: tlow,
		thresholdhigh: thigh,
		duration: duration,
		persistence: persistence,
		maxgap: maxgap
	});

};

RequestHandler.prototype.requestInitialFilePayload = function(project_id, file_id, callback) {
	this._newRequest(callback, globalAppConfig.initialFilePayloadURL, {
		project_id: project_id,
		file_id: file_id
	});
};

RequestHandler.prototype.requestInitialEvaluatorPayload = function(project_id, callback) {
	this._newRequest(callback, globalAppConfig.initialEvaluatorPayloadURL, {
		project_id: project_id,
	});
};

RequestHandler.prototype.requestInitialSupervisorPayload = function(project_id, callback) {
	this._newRequest(callback, globalAppConfig.initialSupervisorPayloadURL, {
		project_id: project_id,
	});
};

RequestHandler.prototype.requestReprioritizeFile = function(project_id, file_idx, callback) {
	this._newRequest(callback, globalAppConfig.prioritizeFileURL, {
		project_id: project_id,
		file_idx: file_idx
	});
};

RequestHandler.prototype.requestAggregateLabelerStats = function(project_id, segment_type, callback) {
	this._newRequest(callback, globalAppConfig.requestLabelerStatsURL, {
		project_id: project_id,
		segment_type: segment_type
	});
}

RequestHandler.prototype.deleteVoteSegments = function(project_id, segments, callback) {
	this._customRequest(callback, globalAppConfig.deleteVoteSegmentsURL, {
		project_id: project_id
	},
	{
		vote_segments: segments
	}, "POST", true);
};

RequestHandler.prototype.submitVoteSegments = function(project_id, created_segments, window_info, callback) {
	this._customRequest(callback, globalAppConfig.submitVoteSegmentsURL, {
		project_id: project_id
	},
	{
		vote_segments: created_segments,
		window_info: window_info
	}, "POST", true);
};

RequestHandler.prototype.getVotes = function(project_id, files, window_info, recalculate, callback) {
	console.log(files);
	this._customRequest(callback, globalAppConfig.getVotesURL, {
		project_id: project_id,
		file_ids: files,
		recalculate: recalculate
	},
	{
		window_info: window_info
	}, "POST", true);
};

RequestHandler.prototype.getSegments = function(project_id, segment_type, callback) {
	this._newRequest(callback, globalAppConfig.getSegmentsURL, {
		project_id: project_id,
		segment_type: segment_type 
	});
};

RequestHandler.prototype.requestSupervisorSeriesByQuery = function(project_id, queryObj, callback) {
	this._customRequest(callback, globalAppConfig.querySupervisorSeriesURL, {
			project_id: project_id
		},
		{
			query_payload: queryObj			
		}, "POST", true);
};

RequestHandler.prototype.requestProjectAnnotations = function(project_id, callback) {
	this._newRequest(callback, globalAppConfig.getProjectAnnotationsURL, {
		project_id: project_id
	})
};

RequestHandler.prototype.requestSeriesRangedData = function(project_id, file_id, series, startTime, stopTime, callback) {
	this._newRequest(callback, globalAppConfig.seriesRangedDataURL, {
		project_id: project_id,
		file_id: file_id,
		s: series,
		start: startTime,
		stop: stopTime
	});
};

RequestHandler.prototype.updateAnnotation = function(id, project_id, file_id, left, right, seriesID, label, callback) {

	this._newRequest(callback, globalAppConfig.updateAnnotationURL, {
		id: id,
		project_id: project_id,
		file_id: file_id,
		xl: left,
		xr: right,
		/*yt: ,
		yb: ,*/
		sid: seriesID,
		label: label
	});

};

const callbackCaller = function(callback, path) {
	return function() {

		if (this.readyState === 4 && this.status === 200) {

			// JSON-decode the response
			let data = {};
			if (this.responseText.length > 0) {
				data = JSON.parse(this.responseText);
			}

			globalAppConfig.verbose && console.log("Response received to " + path, deepCopy(data));

			// Call the callback with data
			if (typeof callback === 'function') {
				let t0 = performance.now();
				callback(data);
				let tt = performance.now() - t0;
				globalAppConfig.performance && tt > globalAppConfig.performanceReportingThresholdGeneral && console.log("Request callback took " + Math.round(tt) + "ms:", path);
			} else {
				console.log("Important: Callback not provided to request handler.");
			}

		}

	}
};

const buildPathWithParams = function(path, params) {
	// Assemble the parameters on the path
	let keys = Object.keys(params);
	for (let i = 0; i < keys.length; i++) {
		if (i === 0) {
			path += '?';
		} else {
			path += '&';
		}
		if (params[keys[i]] != null && params[keys[i]].constructor === Array) {
			for (let j = 0; j < params[keys[i]].length; j++) {
				if (j !== 0) {
					path += '&';
				}
				path += keys[i]+ '[]=' + encodeURIComponent(params[keys[i]][j]);
			}
		} else if (params[keys[i]] || params[keys[i]] === 0) {
			path += keys[i] + '=' + encodeURIComponent(params[keys[i]]);
		} else {
			path += keys[i] + '='
		}
	}

	return path;
}

RequestHandler.prototype._customRequest = function(callback, path, pathParams, objParams, method, withJson=false) {
	let req = new XMLHttpRequest();

	req.onreadystatechange = callbackCaller(callback, path);
	path = buildPathWithParams(path, pathParams);
	req.open(method, path);
	let payload = new FormData();
	for (let param in objParams) {
		payload.append(param, objParams[param]);
	}

	if (withJson) {
		req.setRequestHeader("Content-Type", "application/json");
		payload = JSON.stringify(objParams);
	}
	req.send(payload);
}

// Executes a backend request. Takes an object params with name/value pairs.
// The value may be either a string/string-convertible value or an array of
// such values. In the latter case, the array will be passed in as a GET
// parameter array of values.
RequestHandler.prototype._newRequest = function(callback, path, params) {

	globalAppConfig.verbose && console.log("Sending request to " + path, params);

	// Instantiate a new HTTP request object
	let req = new XMLHttpRequest();

	req.onreadystatechange = callbackCaller(callback, path);

	path = buildPathWithParams(path, params);
	console.log(path);
	req.open("GET", path, true);
	req.send();

};