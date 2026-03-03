import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Order "mo:core/Order";

actor {
  // Data Types
  type CareerPathGoal = { #placement; #higherStudies; #entrepreneurship };
  type Domain = { #software; #dataScience; #design; #research; #management; #hardware; #other };
  type ProficiencyLevel = { #beginner; #intermediate; #advanced; #expert };
  type ActivityType = { #hackathon; #workshop; #project; #competition; #certification };
  type InterviewDomain = { #software; #dataScience; #design; #management };
  type AttemptSelfRating = Nat; // 1-5

  type Interest = {
    domain : Domain;
    level : Nat; // 1-5
  };
  module Interest {
    public func compare(interest1 : Interest, interest2 : Interest) : Order.Order {
      switch (Domain.compare(interest1.domain, interest2.domain)) {
        case (#equal) { Nat.compare(interest1.level, interest2.level) };
        case (order) { order };
      };
    };

    module Domain {
      public func compare(domain1 : Domain, domain2 : Domain) : Order.Order {
        switch (domain1, domain2) {
          case (#software, #software) { #equal };
          case (#software, _) { #less };
          case (#dataScience, #software) { #greater };
          case (#dataScience, #dataScience) { #equal };
          case (#dataScience, _) { #less };
          case (#design, #software) { #greater };
          case (#design, #dataScience) { #greater };
          case (#design, #design) { #equal };
          case (#design, _) { #less };
          case (#research, #software) { #greater };
          case (#research, #dataScience) { #greater };
          case (#research, #design) { #greater };
          case (#research, #research) { #equal };
          case (#research, _) { #less };
          case (#management, #hardware) { #greater };
          case (#hardware, #hardware) { #equal };
          case (#hardware, #other) { #less };
          case (#other, #other) { #equal };
          case (_) { #greater };
        };
      };
    };
  };

  type Skill = {
    name : Text;
    proficiency : ProficiencyLevel;
  };

  type Activity = {
    name : Text;
    activityType : ActivityType;
    date : Text;
    description : Text;
  };

  type InterviewQuestion = {
    question : Text;
    domain : InterviewDomain;
    answer : Text;
  };

  type InterviewAttempt = {
    questionText : Text;
    domain : InterviewDomain;
    answerAttempt : Text;
    selfRating : AttemptSelfRating;
  };

  type StudentProfile = {
    name : Text;
    department : Text;
    year : Nat; // 1-4
    careerPathGoal : CareerPathGoal;
    bio : Text;
    interests : [Interest];
    skills : [Skill];
    activities : [Activity];
    cri : Nat;
  };
  module StudentProfile {
    public func compare(profile1 : StudentProfile, profile2 : StudentProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  type AggregateStats = {
    totalStudents : Nat;
    averageCRI : Nat;
    placementCount : Nat;
    higherStudiesCount : Nat;
    entrepreneurshipCount : Nat;
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  let students = Map.empty<Principal, StudentProfile>();
  let questions = Map.empty<Text, InterviewQuestion>();
  let attempts = Map.empty<Principal, [InterviewAttempt]>();

  // FUNCTIONS

  // Student Profile Management
  public shared ({ caller }) func createOrUpdateProfile(name : Text, department : Text, year : Nat, careerPathGoal : CareerPathGoal, bio : Text, interests : [Interest], skills : [Skill], activities : [Activity]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    let cri = calculateCRI(skills, activities, interests);
    let profile = {
      name;
      department;
      year;
      careerPathGoal;
      bio;
      interests;
      skills;
      activities;
      cri;
    };

    students.add(caller, profile);
  };

  public query ({ caller }) func getMyProfile() : async StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };

    switch (students.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getProfileByPrincipal(p : Principal) : async StudentProfile {
    if (caller != p and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };

    switch (students.get(p)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // Required by frontend: get caller's profile
  public query ({ caller }) func getCallerUserProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    students.get(caller);
  };

  // Required by frontend: save caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    students.add(caller, profile);
  };

  // Required by frontend: get another user's profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?StudentProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    students.get(user);
  };

  // CRI Calculation
  func calculateCRI(skills : [Skill], activities : [Activity], interests : [Interest]) : Nat {
    let numSkills = skills.size();
    let skillWeight = numSkills * 10;

    let activitiesWeight = activities.size() * 15;
    let interestsWeight = interests.size() * 10;

    let totalScore = skillWeight + activitiesWeight + interestsWeight;

    if (totalScore > 100) { 100 } else { totalScore };
  };

  // Mock Interview Management
  public shared ({ caller }) func addInterviewQuestion(questionText : Text, domain : InterviewDomain, answer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add interview questions");
    };

    let question : InterviewQuestion = {
      question = questionText;
      domain;
      answer;
    };

    questions.add(questionText, question);
  };

  public query ({ caller }) func getQuestionsByDomain(domain : InterviewDomain) : async [InterviewQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch interview questions");
    };

    let filtered = questions.values().toArray().filter(
      func(q) {
        q.domain == domain;
      }
    );
    filtered;
  };

  public shared ({ caller }) func submitInterviewAttempt(questionText : Text, domain : InterviewDomain, answerAttempt : Text, selfRating : AttemptSelfRating) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit interview attempts");
    };

    let attempt : InterviewAttempt = {
      questionText;
      domain;
      answerAttempt;
      selfRating;
    };

    let currentAttempts = switch (attempts.get(caller)) {
      case (null) { [] };
      case (?arr) { arr };
    };

    let newAttempts = currentAttempts.concat([attempt]);
    attempts.add(caller, newAttempts);
  };

  public query ({ caller }) func getMyInterviewAttempts() : async [InterviewAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their interview attempts");
    };

    switch (attempts.get(caller)) {
      case (null) { [] };
      case (?arr) { arr };
    };
  };

  // Admin Only: Get all student profiles sorted by CRI
  public query ({ caller }) func getAllProfiles() : async [StudentProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all profiles");
    };

    students.values().toArray().sort();
  };

  // Admin Only: Get aggregate statistics
  public query ({ caller }) func getAggregateStats() : async AggregateStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access aggregate statistics");
    };

    let allProfiles = students.values().toArray();
    let totalStudents = allProfiles.size();

    var totalCRI = 0;
    var placementCount = 0;
    var higherStudiesCount = 0;
    var entrepreneurshipCount = 0;

    for (profile in allProfiles.vals()) {
      totalCRI += profile.cri;
      switch (profile.careerPathGoal) {
        case (#placement) { placementCount += 1 };
        case (#higherStudies) { higherStudiesCount += 1 };
        case (#entrepreneurship) { entrepreneurshipCount += 1 };
      };
    };

    let averageCRI = if (totalStudents > 0) {
      totalCRI / totalStudents;
    } else {
      0;
    };

    {
      totalStudents;
      averageCRI;
      placementCount;
      higherStudiesCount;
      entrepreneurshipCount;
    };
  };
};
